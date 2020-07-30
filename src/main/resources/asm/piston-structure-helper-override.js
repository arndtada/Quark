function injectForEachMethod(method, targetType, clazz, targetName, sig, callback) {
    var ASM = Java.type('net.minecraftforge.coremod.api.ASMAPI');

    var target = ASM.findFirstMethodCall(method,
        targetType,
        clazz,
        targetName,
        sig);

    while (target !== null) {
        var index = method.instructions.indexOf(target);
        var indexShift = callback(target, index);

        var newIndex = method.instructions.indexOf(target);
        if (newIndex !== -1)
            index = newIndex;
        else if (typeof indexShift === 'number')
            index += indexShift;

        target = ASM.findFirstMethodCallAfter(method,
            targetType,
            clazz,
            targetName,
            sig,
            index + 1);
    }

    return method;
}

function initializeCoreMod() {
    return {
        'do-move-replace-structure-helper': {
            'target': {
                'type': 'METHOD',
                'class': 'net.minecraft.block.PistonBlock',
                'methodName': 'func_176319_a', // doMove
                'methodDesc': '(Lnet/minecraft/world/World;Lnet/minecraft/util/math/BlockPos;Lnet/minecraft/util/Direction;Z)Z'
            },
            'transformer': function(method) {
                var ASM = Java.type('net.minecraftforge.coremod.api.ASMAPI');
                var Opcodes = Java.type('org.objectweb.asm.Opcodes');
                var VarInsnNode = Java.type('org.objectweb.asm.tree.VarInsnNode');
                var InsnList = Java.type('org.objectweb.asm.tree.InsnList');

                return injectForEachMethod(method, ASM.MethodType.SPECIAL,
                    "net/minecraft/block/PistonBlockStructureHelper",
                    "<init>",
                    "(Lnet/minecraft/world/World;Lnet/minecraft/util/math/BlockPos;Lnet/minecraft/util/Direction;Z)V",
                    function (target) {

                        var newInstructions = new InsnList();
                        newInstructions.add(new VarInsnNode(Opcodes.ALOAD, 1));
                        newInstructions.add(new VarInsnNode(Opcodes.ALOAD, 2));
                        newInstructions.add(new VarInsnNode(Opcodes.ALOAD, 3));
                        newInstructions.add(new VarInsnNode(Opcodes.ILOAD, 4));
                        newInstructions.add(ASM.buildMethodCall(
                            "vazkii/quark/base/handler/AsmHooks",
                            "transformStructureHelper",
                            "(Lnet/minecraft/block/PistonBlockStructureHelper;Lnet/minecraft/world/World;Lnet/minecraft/util/math/BlockPos;Lnet/minecraft/util/Direction;Z)Lnet/minecraft/block/PistonBlockStructureHelper;",
                            ASM.MethodType.STATIC
                        ));

                        method.instructions.insert(target, newInstructions);
                    });
            }
        },

        'check-for-move-replace-structure-helper': {
            'target': {
                'type': 'METHOD',
                'class': 'net.minecraft.block.PistonBlock',
                'methodName': 'func_176316_e', // checkForMove
                'methodDesc': '(Lnet/minecraft/world/World;Lnet/minecraft/util/math/BlockPos;Lnet/minecraft/block/BlockState;)V'
            },
            'transformer': function(method) {
                var ASM = Java.type('net.minecraftforge.coremod.api.ASMAPI');
                var Opcodes = Java.type('org.objectweb.asm.Opcodes');
                var VarInsnNode = Java.type('org.objectweb.asm.tree.VarInsnNode');
                var InsnNode = Java.type('org.objectweb.asm.tree.InsnNode');
                var InsnList = Java.type('org.objectweb.asm.tree.InsnList');

                return injectForEachMethod(method,
                    ASM.MethodType.SPECIAL, 
                    "net/minecraft/block/PistonBlockStructureHelper",
                    "<init>",
                    "(Lnet/minecraft/world/World;Lnet/minecraft/util/math/BlockPos;Lnet/minecraft/util/Direction;Z)V",
                function (target) {

                    var newInstructions = new InsnList();
                    newInstructions.add(new VarInsnNode(Opcodes.ALOAD, 1));
                    newInstructions.add(new VarInsnNode(Opcodes.ALOAD, 2));
                    newInstructions.add(new VarInsnNode(Opcodes.ALOAD, 4));
                    newInstructions.add(new InsnNode(Opcodes.ICONST_1));
                    newInstructions.add(ASM.buildMethodCall(
                        "vazkii/quark/base/handler/AsmHooks",
                        "transformStructureHelper",
                        "(Lnet/minecraft/block/PistonBlockStructureHelper;Lnet/minecraft/world/World;Lnet/minecraft/util/math/BlockPos;Lnet/minecraft/util/Direction;Z)Lnet/minecraft/block/PistonBlockStructureHelper;",
                        ASM.MethodType.STATIC
                    ));

                    method.instructions.insert(target, newInstructions);

                });
            }
        }
    }
}
